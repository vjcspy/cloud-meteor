export interface UserInterface extends Meteor.User {
  status: number;
  is_disabled: boolean; // Nếu là user bình thường thì sẽ không cho đăng nhập, còn trong context là cashier thì sẽ không tính là 1 user sử dụng
  profile?: Profile;
  created_at?: Date;
  updated_at?: Date;
}
export interface Profile {
  first_name?: String;
  last_name?: String;
  country?: String,
  picture?: String,
  phone?: String
}
