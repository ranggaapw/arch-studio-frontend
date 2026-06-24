const featuredProjects = [
  {
    title: 'Villa Modern di Tengah Hutan',
    category: 'Architecture',
    desc: 'Memadukan material beton ekspos dengan elemen kayu tropis.',
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
    featured: true, // Ukuran besar
  },
  {
    title: 'Minimalist Penthouse',
    category: 'Interior',
    desc: 'Ruang minimalis dengan fokus pada pencahayaan alami.',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    featured: false, // Ukuran kecil
  },
  {
    title: 'Urban Office Hub',
    category: 'Commercial',
    desc: 'Desain kantor fungsional untuk produktivitas tim.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    featured: false, // Ukuran kecil
  },
];

export default function FeaturedProject() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold text-neutral-900 mb-12 text-center">Desain Pilihan Editor</h2>
        
        {/* Layout Grid: 1 besar, 2 kecil di sampingnya */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
          {/* Proyek Utama (Besar) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group md:row-span-2">
            <img src={featuredProjects[0].img} alt={featuredProjects[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 to-transparent w-full">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-body-sm-bold">{featuredProjects[0].category}</span>
              <h3 className="text-h3-bold text-white mt-2">{featuredProjects[0].title}</h3>
            </div>
          </div>

          {/* Proyek Tambahan (Kecil) */}
          {featuredProjects.slice(1).map((project, index) => (
            <div key={index} className="relative rounded-3xl overflow-hidden shadow-xl group">
              <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/70 to-transparent w-full">
                <span className="text-primary-400 text-body-sm-bold uppercase">{project.category}</span>
                <h4 className="text-h5-bold text-white">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}