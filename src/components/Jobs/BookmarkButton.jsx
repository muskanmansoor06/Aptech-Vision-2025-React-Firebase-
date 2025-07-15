import { useState } from 'react';

function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <button title="Bookmark" onClick={() => setBookmarked(!bookmarked)}>
      {bookmarked ? '🔖' : '📑'}
    </button>
  );
}

export default BookmarkButton;
