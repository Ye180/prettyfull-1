import Link from 'next/link';
import Layout from '@/Components/Layout/Layout'; 
const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { marginBottom: '30px', color: '#171717', borderBottom: '2px solid #57a481', paddingBottom: '10px', display: 'inline-block' },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px', 
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #eaecf0', 
    borderRadius: '12px', 
    padding: '25px',
    boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)', // Ombre légère
    textDecoration: 'none',
    color: '#171717', 
    display: 'block', 
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    height: '100%', 
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
  },
  cardTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#171717', 
  },
  cardDescription: {
    fontSize: '0.95em',
    color: '#737373',
    lineHeight: '1.4',
  },
  linkStyle: {
    textDecoration: 'none', 
    color: 'inherit', 
    display: 'block',
    height: '100%',
  }
};

const managementLinks = [
  { href: "/homepage/hero", title: "Section Héro", description: "Modifier la vidéo principale, les textes et le bouton d'action." },
  { href: "/homepage/promoBanners", title: "Bannières Promo", description: "Gérer les images des bannières promotionnelles." },
  { href: "/homepage/sectionTitles", title: "Titres des Sections", description: "Changer les titres des différentes sections (Nouveautés, Collection, etc.)." },
  { href: "/homepage/collectionSection", title: "Section Collection", description: "Ajuster l'image et les textes de la section 'Collection Femme'." },
  { href: "/homepage/miscTexts", title: "Textes Divers", description: "Modifier d'autres textes spécifiques comme le paragraphe central." },
];

export default function HomepageAdminIndex() {

  const pageContent = (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion de la Page d'Accueil</h1>
      <p style={{ color: '#525252' }}>Sélectionnez une section du site client à modifier :</p>

      <div style={styles.cardContainer}>
        {managementLinks.map((linkInfo, index) => (
          <Link
            href={linkInfo.href}
            key={index}
            style={styles.linkStyle} 
            onMouseEnter={(e) => { e.currentTarget.style.transform = styles.cardHover.transform; e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;}}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = styles.card.boxShadow; }}
          >
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>{linkInfo.title}</h2>
              <p style={styles.cardDescription}>{linkInfo.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <Layout title="Gestion Accueil" description="Gestion des éléments de la page d'accueil" dashboard={true}>
      {pageContent}
    </Layout>
  );
}