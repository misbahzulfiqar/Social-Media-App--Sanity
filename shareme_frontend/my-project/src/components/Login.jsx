import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logo.png';
import { client } from '../client';

function Login() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    scope: 'openid profile email',
    onSuccess: async (tokenResponse) => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      if (!res.ok) return;
      const profile = await res.json();
      const profileObj = {
        googleId: profile.sub,
        name: profile.name,
        imageUrl: profile.picture,
      };
      localStorage.setItem('user', JSON.stringify(profileObj));
      const doc = {
        _id: profileObj.googleId,
        _type: 'user',
        userName: profileObj.name,
        image: profileObj.imageUrl,
      };
      await client.createIfNotExists(doc);
      navigate('/', { replace: true });
    },
    onError: () => {
      console.error('Google sign-in failed');
    },
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>

          <div className="shadow-2xl">
          <button
              type="button"
              className="bg-white flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
              onClick={() => login()}
            >
              <FcGoogle className="mr-4" /> Sign in with google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
