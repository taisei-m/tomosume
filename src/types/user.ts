export type User = {
  iconURL: string;
  uid: string;
  userName: string;
  followee: Followee;
  follower: Follower;
};

type Followee = string[];

type Follower = string[];
