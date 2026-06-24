import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../../../services/projectService';

export default function FeaturedProject() {
  const { data: projectsResponse, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  const projects = projectsResponse?.data || [];
  const featuredProjects = projects.filter(p => p.isFeatured);

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-h3-bold text-neutral-900 mb-12 text-center">Desain Terbaik</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neutral-200 animate-pulse rounded-3xl h-[400px]"></div>
            <div className="bg-neutral-200 animate-pulse rounded-3xl h-[400px]"></div>
            <div className="bg-neutral-200 animate-pulse rounded-3xl h-[400px]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || featuredProjects.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold text-neutral-900 mb-12 text-center">Desain Terbaik</h2>
        
        {/* Layout Grid: Dynamic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div key={project.id} className="relative rounded-3xl overflow-hidden shadow-xl group h-[400px]">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full">
                <span className="text-primary-400 text-body-sm-bold uppercase drop-shadow-md">Project</span>
                <h4 className="text-h4-bold text-white mt-1 drop-shadow-md line-clamp-2">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}