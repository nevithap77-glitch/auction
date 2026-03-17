const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Get all group bidding pools
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*, products(*), group_members(*)');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create a new bidding group
router.post('/', async (req, res) => {
  const { name, productId, targetBid, creatorId } = req.body;

  const { data, error } = await supabase
    .from('groups')
    .insert([{ name, product_id: productId, target_bid: targetBid, creator_id: creatorId }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // Add creator as the first member
  await supabase
    .from('group_members')
    .insert([{ group_id: data[0].id, user_id: creatorId, contribution: 0 }]);

  res.json(data[0]);
});

// Join a group / Add contribution
router.post('/contribute', async (req, res) => {
  const { groupId, userId, amount } = req.body;

  const { data, error } = await supabase
    .from('group_members')
    .upsert([{ group_id: groupId, user_id: userId }], { onConflict: ['group_id', 'user_id'] })
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // Increment contribution
  const { error: updateError } = await supabase.rpc('increment_contribution', {
    row_id: data[0].id,
    amount: amount
  });

  if (updateError) return res.status(400).json({ error: updateError.message });

  res.json({ success: true });
});

module.exports = router;
