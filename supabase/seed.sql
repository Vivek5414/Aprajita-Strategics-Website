insert into public.services (slug, title)
values
  ('project-management-epcm-epc', 'Project Management (EPCM/EPC)'),
  ('auditing-estimation-costing', 'Auditing, Estimation & Costing'),
  ('architectural-design', 'Architectural Designing'),
  ('3d-visualization-engineering-design', '3D Visualization & Engineering Design'),
  ('interior-design-execution', 'Interior Designing & Execution'),
  ('facade-design-execution', 'Facade Designing & Execution'),
  ('structural-design', 'Structural Designing'),
  ('mep-design-execution', 'MEP Designing & Execution'),
  ('hvac-design-execution', 'HVAC Designing & Execution'),
  ('solar-plant-design-execution', 'Solar Plant Designing & Execution'),
  ('furnace-design-execution', 'Furnace Designing & Execution'),
  ('clean-room-partition', 'Clean Room Partition'),
  ('industrial-flooring', 'Industrial Flooring'),
  ('water-wastewater-treatment', 'Water Treatment & Wastewater Treatment'),
  ('air-pollution-control-systems', 'Pollution Air Control Systems'),
  ('green-building-solutions', 'Green Building Solutions'),
  ('waterproofing-solutions', 'Waterproofing Solutions')
on conflict (slug) do nothing;
