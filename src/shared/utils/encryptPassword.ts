import { hash, genSalt } from 'bcrypt';


export const encryptPassword = async (password:string) => {
  const salt = await genSalt()
  const encryptedPassword = await hash(password, salt);
  return encryptedPassword;
}