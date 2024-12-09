import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity('topic')
export class TopicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  images: string[];

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: true, default: false })
  recommend: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('user', 'topics')
  user: UserEntity;

  @OneToMany('topic_like', 'topic')
  topicLikes: TopicLikeEntity[];

  @OneToMany('comment', 'topic')
  comments: CommentEntity[];
}

@Entity('topic_like')
export class TopicLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  isLike: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('user', 'topicLikes')
  user: UserEntity;

  @ManyToOne('topic', 'topicLikes')
  topic: TopicEntity;
}
