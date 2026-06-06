import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Recommendations", path: "/recommendations", icon: "🎵" },
    { name: "Favorites", path: "/favorites", icon: "❤️" },
  ];

  return (
    <div className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 p-6">
      <h1 className="text-3xl font-bold text-white mb-10">
        🎧 MusicAI
      </h1>

      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`p-4 rounded-xl transition ${
              location.pathname === link.path
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;