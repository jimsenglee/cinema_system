import { PageContainer } from "@/components/layouts/PageContainer";
import { Heart } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { useState } from "react";
import { movies } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock user favorites - in real app this would come from API/database
const mockFavoriteIds = ["m1", "m3", "m6"]; // Reference actual movie IDs

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState(mockFavoriteIds);
  
  // Get actual movie objects
  const favorites = movies.filter(m => favoriteIds.includes(m.id));

  const handleRemoveFavorite = (id: string) => {
    const movie = movies.find(m => m.id === id);
    setFavoriteIds(favoriteIds.filter(favId => favId !== id));
    toast.success(`"${movie?.title}" removed from favorites`);
  };

  return (
    <PageContainer title="Favorites">
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
          <p className="text-sm text-foreground">
            Your saved movies. Get notified when tickets go on sale!
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              No Favorites Yet
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Start adding movies to your favorites to keep track of what you want to watch!
            </p>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard 
                  movie={movie}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
                <button
                  onClick={() => handleRemoveFavorite(movie.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                  aria-label="Remove from favorites"
                >
                  <Heart className="w-4 h-4 text-white fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        {favorites.length > 0 && (
          <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tap the heart icon on any movie to add it to favorites</li>
              <li>• We'll notify you when your favorite movies have new showtimes</li>
              <li>• Get early access to tickets for premiere screenings</li>
            </ul>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default FavoritesPage;
