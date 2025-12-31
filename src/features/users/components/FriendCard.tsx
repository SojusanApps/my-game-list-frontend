import { Link } from "react-router-dom";
import { Friendship } from "@/client";
import { SafeImage } from "@/components/ui/SafeImage";

interface FriendCardProps {
  friendship: Friendship;
}

export default function FriendCard({ friendship }: FriendCardProps) {
  const { friend, created_at } = friendship;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col items-center gap-3">
        <Link to={`/profile/${friend.id}`} className="block relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-background-100 group-hover:ring-primary-100 transition-all">
            <SafeImage
              className="w-full h-full object-cover"
              src={friend.gravatar_url || undefined}
              alt={`${friend.username}'s avatar`}
            />
          </div>
        </Link>

        <div className="text-center">
          <Link
            to={`/profile/${friend.id}`}
            className="text-lg font-bold text-text-900 hover:text-primary-600 transition-colors block mb-1"
          >
            {friend.username}
          </Link>
          <p className="text-xs text-text-500">Friends since {new Date(created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
