import { Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors, Secret, Jwt } from 'jsonwebtoken';
import { AuthRequest } from 'type';


function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const { cookies } = req;
  if (cookies) {
    const { token } = cookies;

    // verify token
    jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Invalid token' });
      }
      // add user to req
      req.user = decoded;
      next();
    });

  } else {
    // token is not their
    return res.status(401).json({ message: 'Token not found' });
  }
}

export default auth;
