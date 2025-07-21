import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Use the user's ID directly from the session
  const userId = _user._id;

  try {
    // Find the user by their ID using a simpler findById query
    const user = await UserModel.findById(userId);

    if (!user) {
      // This will now only trigger if the user truly doesn't exist in the DB
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Return the user's messages array (it can be empty, which is correct)
    return Response.json(
        {
          messages: user.messages,
        },
        {
          status: 200,
        }
      );

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}