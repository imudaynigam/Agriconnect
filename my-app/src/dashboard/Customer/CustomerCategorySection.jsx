import React from "react";

const categories = [
  {
    name: "Grains",
    img: "https://cdn.pixabay.com/photo/2021/06/30/04/18/rye-6375839_960_720.jpg",
    bg: "bg-red-50"
  },
  {
    name: "Pulses",
    img: "https://cdn.pixabay.com/photo/2016/10/14/13/18/dal-1740205_1280.png",
    bg: "bg-green-100"
  },
  {
    name: "Fruits",
    img: "https://cdn.pixabay.com/photo/2020/05/08/18/16/healthy-5146826_960_720.jpg",
    bg: "bg-yellow-100"
  },
  {
    name: "Vegetables",
    img: "https://cdn.pixabay.com/photo/2017/02/28/20/59/carrots-2106825_960_720.jpg",
    bg: "bg-blue-100"
  },
  {
    name: "Dairy",
    img: "https://cdn.pixabay.com/photo/2016/08/11/23/25/glass-1587258_960_720.jpg",
    bg: "bg-purple-100"
  },
  {
    name: "Spices",
    img: "https://cdn.pixabay.com/photo/2016/05/10/04/31/spice-1383075_960_720.jpg",
    bg: "bg-orange-100"
  },
];

export default function CustomerCategorySection({ selectedCategory, setSelectedCategory }) {
  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    const section = document.getElementById('best-selling-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
          Choose Your Featured Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`w-40 h-48 rounded-xl flex flex-col items-center justify-center shadow-md transition-transform hover:scale-105 ${cat.bg}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white shadow mb-4">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="text-lg font-medium text-gray-700 text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 