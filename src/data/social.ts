import type { SocialLink } from '../types';

export const socialLinks: SocialLink[] = [
  {
    name: 'Email',
    url: 'mailto:kaue.alves.pg@gmail.com',
    icon: 'mail',
    detail: 'kaue.alves.pg@gmail.com',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/victor-kaue-419926364/',
    icon: 'linkedin',
    detail: 'Victor Kauê',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Victorkaue333',
    icon: 'github',
    detail: 'Victorkaue333',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/5587981774951',
    icon: 'whatsapp',
    detail: '(87) 98167-7005',
  },
];

export const navLinks = [
  { label: 'Início', path: '/' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Projetos', path: '/projetos' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Certificados', path: '/certificados' },
  { label: 'Contato', path: '/contato' },
];
