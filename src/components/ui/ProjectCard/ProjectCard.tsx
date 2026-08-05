import {
    FiChevronRight,
    FiExternalLink,
    FiGithub,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { Project } from '../../../types';
import { TechIcon } from '../TechIcon/TechIcon';
import { srcFor, srcSetFor } from '../../../utils/imageSrcSet';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  withReveal?: boolean;
}


export function ProjectCard({ project, withReveal = true }: ProjectCardProps) {
  const projectTitle = project.title || 'Projeto em atualizacao';
  const projectDescription =
    project.description || project.shortDescription || 'Descricao em atualizacao.';
  const projectTechnologies =
    Array.isArray(project.technologies) && project.technologies.length > 0
      ? project.technologies
      : project.stack && project.stack.length > 0
      ? project.stack
      : ['Stack em atualizacao'];
  const detailPath = project.detailPath || `/projetos/${project.slug || project.id}`;
  const imageSrc = project.image || '/images/placeholders/project-placeholder.svg';
  const githubUrl = project.github || 'https://github.com/Victorkaue333';

  return (
    <div className={`project-card ${withReveal ? 'reveal-on-scroll' : ''}`} id={`project-${project.id}`}>
      <Link to={detailPath} className="project-card-link">
        <div className="project-image">
          <img
            src={srcFor(imageSrc, 800)}
            srcSet={srcSetFor(imageSrc)}
            sizes="(max-width: 768px) 90vw, 380px"
            alt={projectTitle}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.srcset = '';
              event.currentTarget.src = '/images/placeholders/project-placeholder.svg';
            }}
          />
          <div className="project-overlay">
            <span className="project-overlay-text">
              Ver detalhes <FiChevronRight size={16} />
            </span>
          </div>
        </div>

        <div className="project-info">
          <h3 className="project-title">{projectTitle}</h3>

          <div className="project-tags">
            {projectTechnologies.slice(0, 5).map((tech: string) => (
              <TechIcon key={tech} name={tech} size={18} className="project-tag-icon-wrapper" />
            ))}
            {projectTechnologies.length > 5 && (
              <span className="project-tag-more">+{projectTechnologies.length - 5}</span>
            )}
          </div>

          <div className="project-author">
            <img
              src="/images/eu/victor-48.webp"
              srcSet="/images/eu/victor-48.webp 1x, /images/eu/victor-96.webp 2x"
              alt="Victor Kauê"
              className="author-avatar"
              width="28"
              height="28"
              loading="lazy"
              decoding="async"
            />
            <span className="author-name">Victor Kauê</span>
          </div>

          <p className="project-desc">{projectDescription}</p>
        </div>
      </Link>

      <div className="project-footer">
        {project.online && (
          <a href={project.online} target="_blank" rel="noopener noreferrer" className="footer-action-link">
            Ver projeto <FiExternalLink size={14} />
          </a>
        )}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="GitHub Repository"
        >
          <FiGithub size={18} />
        </a>
      </div>
    </div>
  );
}
