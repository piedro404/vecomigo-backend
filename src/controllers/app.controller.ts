import { Request, Response, NextFunction, response } from 'express';
import { success } from '../utils/response.js';

export async function home(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = success(
        'API is running', 
        { 
            name: 'VeComigo API', 
            version: '1.0.0', 
            description: 'API para aplicativo de multistream de videos com chat integrado',
            docsUrl: '/',
            authors: [
                { 
                    name: 'Pedro Henrique Martins Borges', 
                    github: 'https://github.com/piedro404',
                    picture: 'https://avatars.githubusercontent.com/u/88720549?v=4'
                },
            ],
        }
    );

    return res.json(response);
  } catch (err) {
    return next(err);
  }
}
