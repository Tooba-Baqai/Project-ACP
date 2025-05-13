import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
  const { api } = useAuth();
  const [items, setItems] = useState([
    {
      id: 1,
      image: "/src/assets/images/Blue-pottery.jpg",
      title: "Blue Pottery Collection",
      category: "blue pottery"
    },
    {
      id: 2,
      image: "/src/assets/images/claypots-1323747_1920-1-1200x1200.jpg",
      title: "Handcrafted Clay Pots",
      category: "pottery"
    },
    {
      id: 3,
      image: "/src/assets/images/portfolio-1.jpg",
      title: "Traditional Vase",
      category: "vase"
    },
    {
      id: 4,
      image: "/src/assets/images/portfolio-2.jpg",
      title: "Decorative Plate",
      category: "clay plate"
    },
    {
      id: 5,
      image: "/src/assets/images/0415a761c33f7aa8d45a768e349fad43.jpg",
      title: "Modern Showpiece",
      category: "showpiece"
    },
    {
      id: 6,
      image: "/src/assets/images/clay-matka-1666332288-6593992.jpeg",
      title: "Clay Matka Set",
      category: "clay matka"
    }
  ]);
  
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Get unique categories for filter buttons
  const categories = ["all", ...new Set(items.map(item => item.category))];

  // Filter items based on category
  const filteredItems = filter === "all" 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="hero py-5 mt-5">
        <Container>
          <div className="hero-content">
            <h1>Our Gallery</h1>
            <p>
              Explore our collection of handcrafted pottery and artistic creations
            </p>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <Container>
          <div className="section-title">
            <h2>Browse Our Collection</h2>
          </div>
          
          {/* Filter Buttons */}
          <div className="text-center mb-5">
            <div className="filter-buttons">
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={filter === category ? "primary" : "outline"}
                  className="text-capitalize mx-2 mb-2"
                  onClick={() => setFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Gallery Items */}
          <Row className="g-4">
            {filteredItems.map(item => (
              <Col lg={4} md={6} key={item.id} className="mb-4">
                <div className="gallery-item">
                  <div className="gallery-img">
                    <img src={item.image} alt={item.title} />
                    <div className="gallery-overlay">
                      {/* View button removed */}
                    </div>
                  </div>
                  <div className="gallery-content">
                    <h4>{item.title}</h4>
                    <p className="text-capitalize">{item.category}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* No Results Message */}
          {filteredItems.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x mb-3"></i>
              <h4>No items found</h4>
              <p>No items match your current filter criteria.</p>
              <Button variant="primary" onClick={() => setFilter("all")}>
                View All Items
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Custom CSS for Gallery */}
      <style jsx="true">{`
        .hero {
          background: linear-gradient(rgba(83, 59, 55, 0.8), rgba(83, 59, 55, 0.8)), url('/src/assets/images/skill-banner.png') no-repeat center center/cover;
          color: white;
          text-align: center;
          padding: 5rem 0;
        }

        .hero h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          color: white;
        }

        .hero p {
          font-size: 1.25rem;
          margin-bottom: 0;
          max-width: 700px;
          margin: 0 auto;
        }

        .filter-buttons {
          margin-bottom: 2rem;
        }

        .gallery-item {
          position: relative;
          margin-bottom: 2rem;
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--box-shadow);
          background: white;
        }

        .gallery-img {
          position: relative;
          height: 280px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-item:hover .gallery-img img {
          transform: scale(1.1);
        }

        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(83, 59, 55, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-content {
          padding: 1.5rem;
        }

        .gallery-content h4 {
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }

        .gallery-content p {
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .view-btn {
          padding: 0.5rem 1.5rem;
        }

        .section-title h2 {
          font-size: 2.5rem;
          position: relative;
          display: inline-block;
          padding-bottom: 1rem;
          color: var(--primary-color);
        }

        .section-title h2::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background-color: var(--primary-color);
        }
      `}</style>
    </div>
  );
};

export default Gallery; 