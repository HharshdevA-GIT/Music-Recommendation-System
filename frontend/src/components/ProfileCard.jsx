function ProfileCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
          👤
        </div>

        <div>
          <h2 className="text-white text-xl font-bold">
            Music Lover
          </h2>

          <p className="text-gray-400">
            Premium Listener
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div>
          <h3 className="text-purple-400 text-2xl font-bold">
            120
          </h3>
          <p className="text-gray-500">Songs</p>
        </div>

        <div>
          <h3 className="text-pink-400 text-2xl font-bold">
            25
          </h3>
          <p className="text-gray-500">Favorites</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;