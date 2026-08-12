import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLinkedin } from 'react-icons/fa6';
import { FiFileText, FiMail, FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import { SiGithub, SiWhatsapp } from 'react-icons/si';
import { Button } from '../../components/ui/Button/Button';
import { PageHero } from '../../components/ui/PageHero/PageHero';
import { socialLinks } from '../../data/social';
import { useSeo } from '../../hooks/useSeo';
import type { ContactFormData } from '../../types';
import './Contato.css';

const WHATSAPP_PHONE = '5587981774951';

function buildWhatsAppUrl(data: ContactFormData): string {
  const message = encodeURIComponent(
    `Nova mensagem do Portfólio\n\n` +
    `Nome: ${data.nome}\n` +
    `Email: ${data.email}\n` +
    `Assunto: ${data.assunto}\n\n` +
    `Mensagem:\n${data.mensagem}`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

export default function Contato() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactFormData>({ nome: '', email: '', assunto: '', mensagem: '' });
  const [sent, setSent] = useState(false);
  const sentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSeo({
    title: t('seo.contactTitle'),
    description: t('seo.contactDesc'),
    path: '/contato',
  });

  useEffect(() => {
    return () => { if (sentTimer.current) clearTimeout(sentTimer.current); };
  }, []);

  const filledFields = [form.nome, form.email, form.assunto, form.mensagem].filter(Boolean).length;
  const progress = (filledFields / 4) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppUrl(form);
    window.open(url, '_blank');
    setSent(true);
    setForm({ nome: '', email: '', assunto: '', mensagem: '' });
    if (sentTimer.current) clearTimeout(sentTimer.current);
    sentTimer.current = setTimeout(() => setSent(false), 4000);
  };

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const socialIconMap = {
    mail: FiMail,
    linkedin: FaLinkedin,
    github: SiGithub,
    whatsapp: SiWhatsapp,
  } as const;

  return (
    <main className="page-contato">
      <section className="contact-hero content-section">
        <div className="container">
          <PageHero
            titleMain={t('contato.heroMain')}
            titleAccent={t('contato.heroAccent')}
            subtitle={t('contato.heroSubtitle')}
            icon={<FiSend size={22} />}
          />

          <div className="contact-layout">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-progress">
                <div className="form-progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <div className="form-group">
                <label htmlFor="nome"><FiUser size={16} /> {t('contato.nome')}</label>
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange('nome')}
                  required
                  placeholder={t('contato.nomePh')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email"><FiMail size={16} /> {t('contato.email')}</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  placeholder={t('contato.emailPh')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assunto"><FiFileText size={16} /> {t('contato.assunto')}</label>
                <input
                  id="assunto"
                  type="text"
                  value={form.assunto}
                  onChange={handleChange('assunto')}
                  required
                  placeholder={t('contato.assuntoPh')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensagem"><FiMessageSquare size={16} /> {t('contato.mensagem')}</label>
                <textarea
                  id="mensagem"
                  value={form.mensagem}
                  onChange={handleChange('mensagem')}
                  required
                  rows={5}
                  maxLength={1000}
                  placeholder={t('contato.mensagemPh')}
                />
                <span className="char-counter">{form.mensagem.length}/1000</span>
              </div>

              <Button type="submit" variant="primary" className="submit-btn">
                <FiSend size={18} />
                {t('contato.submit')}
              </Button>

              {sent && (
                <div className="form-success">
                  {t('contato.success')}
                </div>
              )}
            </form>

            <aside className="contact-sidebar">
              <h3>{t('contato.otherWays')}</h3>
              <div className="contact-cards">
                {socialLinks.map((s) => (
                  <a key={s.name} href={s.url} className={`contact-card ${s.name.toLowerCase()}`} target="_blank" rel="noopener noreferrer">
                    {(() => {
                      const Icon = socialIconMap[s.icon as keyof typeof socialIconMap] || FiMail;
                      return <Icon size={20} aria-hidden="true" />;
                    })()}
                    <div>
                      <strong>{s.name}</strong>
                      <span>{s.detail}</span>
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
