import type { Project } from '../../../types';

export const queelvra: Project = {
  id: 'queelvra',
  slug: 'queelvra',
  title: 'Queelvra',
  shortDescription: 'Landing page orientada à conversão.',
  detailedDescription:
    'Página comercial com foco em performance, design objetivo e captura de leads.',
  description: 'Landing page de alta conversão para divulgação de serviços.',
  image: '/images/fotos-projetos-reais/queelvra/queelvra.webp',
  detailPath: '/projetos/queelvra',
  technologies: ['Landing Page', 'Front-end', 'Conversão'],
  stack: ['HTML', 'CSS', 'JavaScript'],
  features: ['Copy comercial', 'CTA estratégico', 'Layout de conversão'],
  category: 'real',
  summary: {
    problema: 'Baixa conversão de visitantes interessados nos serviços',
    solucao: 'Landing page otimizada com foco em UX e gatilhos de conversão',
    stack: 'HTML, CSS e JavaScript',
  },
  detailed_info: {
    desafio: 'Criar uma página extremamente leve e rápida que transmita autoridade instantânea.',
    solucao: 'Desenvolvimento em HTML/CSS puro com animações sutis e foco em copywriting.',
    impacto: 'Aumento significativo na taxa de cliques e conversão de leads qualificados.',
    arquitetura: {
      frontend: 'HTML5 Semântico / CSS3 Moderno',
      api: 'Integração de formulários via API',
      banco: 'Não aplicável (Página estática)',
    },
    decisoes: {
      autenticacao: 'Não aplicável',
      backend: 'Lógica mínima em JavaScript',
      deploy: 'Hospedagem de alta performance',
      banco: 'Sem necessidade de persistência local',
    },
    tech_v2: [
      { name: 'HTML5', icon: 'devicon-html5-plain colored' },
      { name: 'CSS3', icon: 'devicon-css3-plain colored' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
    ],
  },
};
