import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { client, urlFor } from '../client';

const Pin = ({ pin }) => {
  if (!pin) return null;
  const user = localStorage.getItem('user') !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  const alreadySaved = !!pin?.save?.filter((item) => item?.postedBy?._id === user?.googleId)?.length;
  const [isSaved, setIsSaved] = useState(alreadySaved);

  const savePin = (id) => {
    if (isSaved) return;
    if (!user?.googleId) {
      toast.error('Please login first');
      return;
    }

    client.patch(id)
      .setIfMissing({ save: [] })
      .insert('after', 'save[-1]', [{
        _key: uuidv4(),
        userId: user.googleId,
        postedBy: {
          _type: 'postedBy',
          _ref: user.googleId,
        },
      }])
      .commit()
      .then(() => {
        const saveDoc = {
          _type: 'save',
          userId: user.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user.googleId,
          },
        };
        return client.create(saveDoc);
      })
      .then(() => {
        setIsSaved(true);
        toast.success('Your post is saved');
      })
      .catch(() => {
        toast.error('Failed to save post');
      });
  };

  return (
    <div className="m-2">
      <Link to={`/pin-detail/${pin._id}`} className="relative block cursor-pointer group" aria-label="Open pin detail">
        <img
          className="rounded-lg w-full"
          src={urlFor(pin.image).width(250).url()}
          alt="user-post"
          loading="lazy"
        />
        <div className="absolute top-0 z-10 w-full h-full rounded-lg bg-blackOverlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex justify-between items-center p-2">
            <a
              href={`${pin?.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 pointer-events-auto"
            >
              <MdDownloadForOffline />
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                savePin(pin._id);
              }}
              className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-4 py-1 rounded-3xl pointer-events-auto"
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
          <div className="flex justify-between items-center absolute bottom-3 left-2 right-2">
            {pin.destination && (
              <a
                href={pin.destination}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-white flex items-center gap-1 p-2 rounded-full text-black text-xs font-semibold max-w-[70%] truncate pointer-events-auto"
              >
                <BsFillArrowUpRightCircleFill />
                {pin.destination}
              </a>
            )}
            <Link
              to={`/pin-detail/${pin._id}`}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl pointer-events-auto"
            >
              <BsFillArrowUpRightCircleFill />
            </Link>
          </div>
        </div>
      </Link>
      <div className="flex mt-2 items-center justify-between">
        <Link to={`/user-profile/${pin.postedBy?._id}`} className="flex gap-2 items-center">
          <img
            src={pin.postedBy?.image}
            className="w-8 h-8 rounded-full object-cover"
            alt="user-profile"
          />
          <p className="font-semibold text-sm">{pin.postedBy?.userName}</p>
        </Link>
      </div>
    </div>
  );
};

export default Pin;