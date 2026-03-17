const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Get bid history for a product
router.get('/:productId', async (req, res) => {
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('product_id', req.params.productId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Place a new bid
router.post('/', async (req, res) => {
  const { productId, userId, amount } = req.body;

  // 1. Check if bid is higher than current bid
  const { data: product, error: pError } = await supabase
    .from('products')
    .select('current_bid')
    .eq('id', productId)
    .single();

  if (pError || !product) return res.status(400).json({ error: 'Product not found' });
  if (amount <= product.current_bid) return res.status(400).json({ error: 'Bid must be higher than current bid' });

  // 2. Insert bid
  const { data: bid, error: bError } = await supabase
    .from('bids')
    .insert([{ product_id: productId, user_id: userId, amount }])
    .select();

  if (bError) return res.status(400).json({ error: bError.message });

  // 3. Update product current_bid
  const { error: uError } = await supabase
    .from('products')
    .update({ current_bid: amount })
    .eq('id', productId);

  if (uError) return res.status(400).json({ error: uError.message });

  res.json(bid[0]);
});

module.exports = router;
