-- Add items column to receipts table
alter table receipts 
add column items jsonb default '[]'::jsonb;
