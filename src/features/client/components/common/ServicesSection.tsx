import { useQuery } from '@tanstack/react-query';
import * as LucideIcons from 'lucide-react';
import { serviceService } from '../../../../services/serviceService';

// Helper component to render Lucide icon from string name
const IconRenderer = ({ name, className }: { name?: string, className?: string }) => {
  if (!name) return null;
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export default function ServicesSection() {
  const { data: servicesResponse, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });

  const services = servicesResponse?.data || [];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold text-neutral-900 mb-4 text-center">Layanan Kami</h2>
        <p className="text-body-lg-regular text-neutral-500 text-center mb-16 max-w-2xl mx-auto">
          Kami memberikan solusi arsitektur menyeluruh dengan fokus pada kualitas, inovasi, dan kepuasan klien.
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 animate-pulse">
                <div className="w-8 h-8 bg-neutral-200 rounded mb-6"></div>
                <div className="h-6 w-3/4 bg-neutral-200 rounded mb-3"></div>
                <div className="h-20 w-full bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-10">Gagal memuat layanan.</div>
        ) : services.length === 0 ? (
          <div className="text-center text-neutral-500 py-10">Belum ada layanan yang ditambahkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  {service.iconName ? (
                    <IconRenderer name={service.iconName} className="w-8 h-8 text-primary-600" />
                  ) : (
                    <LucideIcons.CheckCircle className="w-8 h-8 text-primary-600" />
                  )}
                </div>
                <h3 className="text-h5-bold text-neutral-900 mb-3">{service.title}</h3>
                <p className="text-body-md-regular text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}