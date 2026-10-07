// Catálogo de Produtos e Amostras de Impressão 3D FDM - PatoFigures3D
const PRODUCTS = [
  {
    id: 'cyber-samurai',
    name: 'Samurai Cibernético (Edição de Colecionador)',
    category: 'geek',
    categoryName: 'Action Figures & Colecionáveis',
    price: 189.90,
    oldPrice: 220.00,
    image: 'assets/cyber_samurai.jpg',
    badge: 'Destaque',
    material: 'PLA Silk Bicolor (Azul Metálico e Dourado)',
    layerHeight: '0.12 mm (Super Fina)',
    printTime: '28 horas de impressão',
    infill: '20% Gyroid Estrutural',
    dimensions: '24 cm de altura',
    weight: '340g',
    description: 'Action figure com nível extremo de acabamento fatiado em camadas finas de 0.12mm. Impresso em filamento PLA Silk nobre que confere brilho metálico uniforme. Acompanha base de apoio e espadas destacáveis.',
    features: [
      'Articulações firmes com encaixe calibrado',
      'Katana e espada curta removíveis',
      'Base de apoio sólida e estável',
      'Acabamento limpo com suportes manuais retirados com precisão'
    ],
    inStock: true
  },
  {
    id: 'articulated-dragon',
    name: 'Dragão Cristalino Articulado',
    category: 'articulados',
    categoryName: 'Articulados & Flexíveis',
    price: 139.90,
    oldPrice: 165.00,
    image: 'assets/articulated_dragon.jpg',
    badge: 'Mais Vendido',
    material: 'PLA Silk Arco-Íris Iridescente',
    layerHeight: '0.16 mm',
    printTime: '19 horas de impressão',
    infill: '15% Cúbico',
    dimensions: '45 cm de comprimento',
    weight: '210g',
    description: 'Criatura articulada impressa em peça única (Print-in-Place). O corpo possui dezenas de vértebras móveis com articulação livre e fluida, alternando tons de cor conforme a iluminação do ambiente.',
    features: [
      'Impresso já montado, sem colagens',
      'Movimentação fluida e agradável ao toque',
      'Excelente peça para mesa de trabalho ou estante',
      'Filamento especial com gradiente multicolorido suave'
    ],
    inStock: true
  },
  {
    id: 'mech-warrior',
    name: 'Guerreiro Mecatrônico Articulado',
    category: 'geek',
    categoryName: 'Action Figures & Colecionáveis',
    price: 199.90,
    oldPrice: 240.00,
    image: 'assets/mech_warrior.jpg',
    badge: 'Edição Especial',
    material: 'PLA+ Fosco Cinza Chumbo & Laranja',
    layerHeight: '0.12 mm',
    printTime: '32 horas de impressão',
    infill: '25% Tri-Hexagonal',
    dimensions: '26 cm de altura',
    weight: '420g',
    description: 'Figura de ação com proporções imponentes e dezenas de pontos de encaixe mecânico. Produzido com as cores características da oficina em acabamento fosco profissional que elimina reflexos indesejados.',
    features: [
      'Rifle e escudo destacáveis',
      'Encaixes calibrados para sustentação de poses dinâmicas',
      'Tolerâncias milimétricas sem folgas excessivas',
      'Material resistente que não deforma com o tempo'
    ],
    inStock: true
  },
  {
    id: 'gear-phone-stand',
    name: 'Suporte de Celular com Engrenagens Mecânicas',
    category: 'utilidades',
    categoryName: 'Utilidades & Desk Setup',
    price: 89.90,
    oldPrice: 110.00,
    image: 'assets/gear_phone_stand.jpg',
    badge: 'Engenharia Prática',
    material: 'PETG Carbono & Ciano',
    layerHeight: '0.16 mm',
    printTime: '12 horas de impressão',
    infill: '30% Giroide Estrutural',
    dimensions: '14 x 11 x 9 cm',
    weight: '190g',
    description: 'Suporte de smartphone funcional com engrenagens móveis que sincronizam o ajuste do ângulo de visão. Desenvolvido em PETG, plástico de engenharia que suporta impactos e variações térmicas sem fadiga.',
    features: [
      'Engrenagens funcionais impressas em 3D',
      'Canal inferior para passagem do cabo de carregamento',
      'Compatível com smartphones de todos os tamanhos',
      'Base antiderrapante com excelente apoio'
    ],
    inStock: true
  },
  {
    id: 'headphone-stand',
    name: 'Suporte para Headset Gamer e Controle',
    category: 'utilidades',
    categoryName: 'Utilidades & Desk Setup',
    price: 129.90,
    oldPrice: 150.00,
    image: 'assets/headphone_stand.jpg',
    badge: 'Top Avaliado',
    material: 'PETG Fosco Cinza Escuro & Laranja',
    layerHeight: '0.16 mm',
    printTime: '22 horas de impressão',
    infill: '20% Giroide',
    dimensions: '27 cm de altura',
    weight: '380g',
    description: 'Organizador de mesa completo com design geométrico limpo. Acomoda com firmeza qualquer modelo de headset gamer na parte superior e berço frontal projetado para controles de PlayStation, Xbox ou Switch.',
    features: [
      'Base larga e estável com centro de gravidade baixo',
      'Não marca nem desgasta o arco do fone de ouvido',
      'Apoio ergonômico para controle sem risco de quedas',
      'Acabamento acetinado que combina com qualquer setup'
    ],
    inStock: true
  },
  {
    id: 'duck-companion',
    name: 'Mascote Pato Low-Poly com Mini Vaso',
    category: 'articulados',
    categoryName: 'Colecionáveis & Mesa',
    price: 69.90,
    oldPrice: 85.00,
    image: 'assets/duck_companion.jpg',
    badge: 'Mascote Oficial',
    material: 'PLA Premium Branco Puro & Bico Laranja',
    layerHeight: '0.16 mm',
    printTime: '8 horas de impressão',
    infill: '15% Cúbico',
    dimensions: 'Pato: 11 cm | Vaso: 8 cm',
    weight: '140g',
    description: 'O mascote oficial da PatoFigures3D em formato físico para decoração de mesa. Acompanha pequeno vasinho geométrico facetado para suculentas naturais ou artificiais.',
    features: [
      'Geometria facetada limpa e marcante',
      'Vasinho geométrico combinando no mesmo estilo',
      'Excelente opção de presente ou peça de mesa',
      'Impressão sem costuras visíveis na face frontal'
    ],
    inStock: true
  }
];

// Configurações Oficiais da Loja
const CONFIG = {
  brandName: 'Pato Figures 3D',
  tagline: 'Action Figures & Soluções em Impressão 3D',
  // Chave Pix Oficial Atualizada
  pixKey: 'patofigures3d@gmail.com',
  pixReceiverName: 'PATOFIGURES3D',
  pixReceiverCity: 'PATO BRANCO',
  pixDiscountPercent: 5,
  couponCode: 'PATO10',
  couponDiscountPercent: 10,
  whatsappNumber: '5546988259042', // (46) 98825-9042
  whatsappDisplay: '(46) 98825-9042',
  mercadoPagoLink: '' // Caso queira colocar um link direto do Mercado Pago
};
