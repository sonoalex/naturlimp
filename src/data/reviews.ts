export interface GoogleReview {
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  source: 'Google';
}

export const REAL_GOOGLE_REVIEWS = [
  {
    name: 'Miguel Martín Martín',
    rating: 5,
    dateEs: 'Hace 3 meses',
    dateCa: 'Fa 3 mesos',
    text: 'Son muy competentes, Raquel muy pendiente en todo momento de que todo quedara bien, con buenos precios, quedé muy satisfecho. Recomiendo 100%',
  },
  {
    name: 'patricia mm',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Atención personalizada, tienen en cuenta hasta el último detalle, relación calidad-precio genial. Hasta el momento la mejor empresa de limpieza y pintura. Tanto los trabajadores como la jefa, un encanto todos.',
  },
  {
    name: 'Alex A.',
    rating: 5,
    dateEs: 'Hace 3 semanas',
    dateCa: 'Fa 3 setmanes',
    text: 'Estem molt contents amb el tracte i el servei de naturlimp a la comunitat',
  },
  {
    name: 'Ester Lampreave',
    rating: 5,
    dateEs: 'Hace 6 meses',
    dateCa: 'Fa 6 mesos',
    text: 'Sí, estoy totalmente satisfecha, han hecho un buen trabajo, todos los que han venido a limpiar son muy profesionales y trabajan muy bien, muy recomendable',
  },
  {
    name: 'francisco javier',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Es una empresa que a nuestra comunidad de vecinos nos hace el trabajo de limpieza y mantenimiento muy bien, así que nosotros seguimos contando con ellos',
  },
  {
    name: 'sandra patricia loaiza vergara',
    rating: 5,
    dateEs: 'Hace 3 semanas',
    dateCa: 'Fa 3 setmanes',
    text: 'Excelente servicio y responsabilidad, con productos de gran calidad. Totalmente recomendados.',
  },
  {
    name: 'Pilar Delgado Guerrero',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Una gran empresa con personal cualificado. Y destacar el trato cercano de Raquel y su predisposición. La recomiendo.',
  },
  {
    name: 'JOAN BEL',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Servei ràpid i molt professional!!',
  },
  {
    name: 'Pilar Ramos',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Un acierto contratar a esta empresa, Raquel siempre tan competente, transparente y honesta, muy recomendable.',
  },
  {
    name: 'carlos cccp',
    rating: 5,
    dateEs: 'Hace 3 semanas',
    dateCa: 'Fa 3 setmanes',
    text: 'El Sr Jairo es una excelente persona y profesional.',
  },
  {
    name: 'Natalia Seor',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Empresa muy responsable y personal amable y muy trabajador. Limpieza y compromiso de 10',
  },
  {
    name: 'Pierina Torredemer cavallari',
    rating: 5,
    dateEs: 'Hace 3 semanas',
    dateCa: 'Fa 3 setmanes',
    text: 'Excelente atencion y cuidando todos los detalles.',
  },
  {
    name: 'Sandra Roa',
    rating: 5,
    dateEs: 'Hace 7 meses',
    dateCa: 'Fa 7 mesos',
    text: 'Excelente empresa con calidad del servicio y de personal se los recomiendo.',
  },
  {
    name: 'Erika Moreno',
    rating: 5,
    dateEs: 'Hace 11 meses',
    dateCa: 'Fa 11 mesos',
    text: 'Muy buenos profesionales, muy resolutivos y gran capacidad de trabajo.',
  },
  {
    name: 'Toñi Montoro Garzon',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Muy buen servicio. Raquel es una gran profesional',
  },
  {
    name: 'Nuria Cebrian Garcia',
    rating: 5,
    dateEs: 'Hace 1 semana',
    dateCa: 'Fa 1 setmana',
    text: 'Buen servicio y atencion',
  },
  {
    name: 'Marta Barea',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Són muy competentes. Relacion calidad precio perfecta.',
  },
  {
    name: 'Edu Garcia',
    rating: 5,
    dateEs: 'Hace 5 meses',
    dateCa: 'Fa 5 mesos',
    text: 'Un placer contactar con esta empresa para sus servicios.',
  },
  {
    name: 'Mateo Fernandez',
    rating: 5,
    dateEs: 'Hace 11 meses',
    dateCa: 'Fa 11 mesos',
    text: 'Cumplidores y muy eficientes',
  },
  {
    name: 'Loli Dominguez',
    rating: 5,
    dateEs: 'Hace 3 semanas',
    dateCa: 'Fa 3 setmanes',
    text: 'Muy profesionales.',
  },
  {
    name: 'Rubenuco',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Super profesionales!!!!',
  },
  {
    name: 'Maria Espadas',
    rating: 5,
    dateEs: 'Hace 5 meses',
    dateCa: 'Fa 5 mesos',
    text: 'Todo perfecto buen trabajo',
  },
  {
    name: 'PERALBER Peralber',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'LO MEJOR DE LO MEJOR',
  },
  {
    name: 'Santi Lopez',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Profesionales en todo momento muy muy bien',
  },
  {
    name: 'Luci Fuentes',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Profesionales y responsable . Todo perfecto',
  },
  {
    name: 'Gestiona I Més SL',
    rating: 5,
    dateEs: 'Hace 8 meses',
    dateCa: 'Fa 8 mesos',
    text: 'Perfecto',
  },
  {
    name: 'Gaspar Nadal',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Buenos profesionales.',
  },
  {
    name: 'Juan Martinez',
    rating: 5,
    dateEs: 'Hace un año',
    dateCa: 'Fa 1 any',
    text: 'Todo perfecto',
  },
];

export function getGoogleReviews(lang: 'es' | 'ca'): GoogleReview[] {
  const isCa = lang === 'ca';
  const defaultRole = isCa ? 'Ressenya de Google' : 'Reseña de Google';
  return REAL_GOOGLE_REVIEWS.map(r => ({
    name: r.name,
    role: defaultRole,
    rating: r.rating,
    text: r.text,
    date: isCa ? r.dateCa : r.dateEs,
    source: 'Google' as const,
  }));
}
