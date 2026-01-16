insert into public.series_carga (codigo, nombre, descripcion)
values
  ('SER-001', 'Serie base', 'Serie de ejemplo'),
  ('SER-002', 'Serie secundaria', 'Otra serie para pruebas');

insert into public.subseries_carga (codigo, nombre, descripcion, serie_codigo)
values
  ('SUB-001', 'Subserie A', 'Subserie relacionada', 'SER-001'),
  ('SUB-002', 'Subserie B', 'Subserie relacionada', 'SER-002');

insert into public.series_vinculacion (serie_id, entidad)
select id, 'entidad_demo' from public.series_carga limit 1;

insert into public.subseries_vinculacion (subserie_id, entidad)
select id, 'entidad_demo' from public.subseries_carga limit 1;
