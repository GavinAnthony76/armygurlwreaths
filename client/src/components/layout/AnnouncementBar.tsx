import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

interface Announcement {
  id: string;
  message: string;
  linkText: string | null;
  linkUrl: string | null;
  bgColor: string;
  textColor: string;
}

export default function AnnouncementBar() {
  const { data } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => api.get('/announcements/active').then((r) => r.data.data as Announcement[]),
    staleTime: 1000 * 60 * 10,
  });

  const announcement = data?.[0];
  if (!announcement) return null;

  return (
    <div
      className="py-2 px-4 text-center text-[10px] sm:text-xs font-medium tracking-wide"
      style={{ backgroundColor: announcement.bgColor, color: announcement.textColor }}
    >
      <span>{announcement.message}</span>
      {announcement.linkText && announcement.linkUrl && (
        <Link
          to={announcement.linkUrl}
          className="ml-1 sm:ml-2 underline font-semibold hover:opacity-80 transition-opacity"
        >
          {announcement.linkText}
        </Link>
      )}
    </div>
  );
}
