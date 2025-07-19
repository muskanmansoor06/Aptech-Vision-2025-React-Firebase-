import { useState } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <button title="Bookmark" onClick={() => setBookmarked(!bookmarked)} className="icon-btn">
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
}

export default BookmarkButton;
