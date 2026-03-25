import { Link } from "@tanstack/react-router";
import { Box, Stack, Text } from "@mantine/core";
import { Friendship } from "@/client";
import { SafeImage } from "@/components/ui/SafeImage";

interface FriendCardProps {
  friendship: Friendship;
}

export default function FriendCard({ friendship }: Readonly<FriendCardProps>) {
  const { friend, created_at } = friendship;

  return (
    <Box className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden hover:shadow-md transition-shadow">
      <Stack align="center" gap={12} className="p-4">
        <Link to={"/profile/$id"} params={{ id: friend.id.toString() }} className="block relative group">
          <Box className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-background-100 group-hover:ring-primary-100 transition-all">
            <SafeImage
              className="w-full h-full object-cover"
              src={friend.gravatar_url || undefined}
              alt={`${friend.username}'s avatar`}
            />
          </Box>
        </Link>

        <Box className="text-center">
          <Link
            to={"/profile/$id"}
            params={{ id: friend.id.toString() }}
            className="text-lg font-bold text-text-900 hover:text-primary-600 transition-colors block mb-1"
          >
            {friend.username}
          </Link>
          <Text size="xs" className="text-text-500">
            Friends since {new Date(created_at).toLocaleDateString()}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
