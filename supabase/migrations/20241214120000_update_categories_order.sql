-- Update get_categories_with_counts function to sort by display_order
CREATE OR REPLACE FUNCTION get_categories_with_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  icon TEXT,
  parent_id UUID,
  level INT,
  display_order INT,
  product_count INT,
  subcategories_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.icon,
    c.parent_id,
    c.level,
    c.display_order,
    c.product_count,
    (SELECT COUNT(*)::INT FROM categories sub WHERE sub.parent_id = c.id) as subcategories_count
  FROM categories c
  ORDER BY c.level, c.display_order, c.name;
END;
$$ LANGUAGE plpgsql;
