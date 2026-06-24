import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../../../services/projectService';

export default function ProjectCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const { data: projectsResponse, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  const projects = projectsResponse?.data || [];

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="w-full py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold text-neutral-900 mb-12 text-center">Desain Terbaru Kami</h2>

        {/* Carousel Container */}
        <div className="relative flex items-center">
          <button 
            onClick={scrollPrev} 
            className="absolute -left-4 md:-left-16 bg-white p-3 rounded-full shadow-arch-lg hover:bg-primary-50 transition-colors z-10 text-neutral-900 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex -ml-6">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex-[0_0_100%] md:flex-[0_0_33.333%] pl-6">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-arch-lg h-80 animate-pulse">
                       <div className="w-full h-56 bg-neutral-200"></div>
                       <div className="p-6">
                         <div className="h-6 w-3/4 bg-neutral-200 rounded"></div>
                       </div>
                    </div>
                  </div>
                ))
              ) : isError ? (
                <div className="w-full text-center py-10 text-red-500">Failed to load projects</div>
              ) : projects.length === 0 ? (
                <div className="w-full text-center py-10 text-neutral-500">Belum ada proyek yang ditambahkan.</div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="flex-[0_0_100%] md:flex-[0_0_33.333%] pl-6">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-arch-lg h-full transition-transform hover:-translate-y-2">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-80 object-cover" draggable="false" />
                      <div className="p-6">
                        <span className="text-body-sm-medium text-primary-600">Project</span>
                        <h3 className="text-h5-bold text-neutral-900 mt-1 line-clamp-1">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={scrollNext} 
            className="absolute -right-4 md:-right-16 bg-white p-3 rounded-full shadow-arch-lg hover:bg-primary-50 transition-colors z-10 text-neutral-900 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}