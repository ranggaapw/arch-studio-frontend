import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  { title: 'Modern Living Room', category: 'Interior', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0' },
  { title: 'Minimalist Dining', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6', category: 'Interior' },
  { title: 'Luxury Closet', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120f0', category: 'Interior' },
  { title: 'Villa Modern', img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233', category: 'Architecture' },
  { title: 'Home Office Space', img: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705', category: 'Architecture' },
  { title: 'Tropical Terrace', img: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253', category: 'Consulting' },
];

const categories = ['All', 'Architecture', 'Interior', 'Consulting'];

export default function ProjectCarousel() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section className="w-full py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold text-neutral-900 mb-8 text-center">Desain Terbaru Kami</h2>

        {/* Filter Kategori */}
        <div className="flex justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Carousel Container */}
        <div className="relative flex items-center">
          <button 
            onClick={scrollPrev} 
            className="absolute -left-16 bg-white p-3 rounded-full shadow-arch-lg hover:bg-primary-50 transition-colors z-10 text-neutral-900"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex -ml-6">
              {filteredProjects.map((project, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_33.333%] pl-6">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-arch-lg h-full transition-transform hover:-translate-y-2">
                    <img src={project.img} alt={project.title} className="w-full h-80 object-cover" draggable="false" />
                    <div className="p-6">
                      <span className="text-body-sm-medium text-primary-600">{project.category}</span>
                      <h3 className="text-h5-bold text-neutral-900 mt-1">{project.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={scrollNext} 
            className="absolute -right-16 bg-white p-3 rounded-full shadow-arch-lg hover:bg-primary-50 transition-colors z-10 text-neutral-900"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}