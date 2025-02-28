import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { GroupState } from 'src/app/ngrx/states/group.state';
import { UserState } from 'src/app/ngrx/states/user.state';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Observable, Subscription, combineLatest, mergeMap } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { Profile } from 'src/app/models/profile.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as GroupActions from 'src/app/ngrx/actions/group.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { group } from '@angular/animations';
import { PostState } from 'src/app/ngrx/states/post.state';
import * as PostActions from 'src/app/ngrx/actions/post.actions';
import { Post } from 'src/app/models/post.model';
@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
})
export class InternalComponent implements OnInit, OnDestroy {
  isJoinSuccess$ = this.store.select('group', 'isSuccess');

  errorMessage$ = this.store.select('group', 'errorMessage');

  groups: Group = <Group>{};
  groups$: Observable<Group> = this.store.select('group', 'group');
  isGetSuccess$ = this.store.select('group', 'isGetSuccess');

  groupsList: Group[] = [];
  groupsList$: Observable<Group[]> = this.store.select('group', 'groupList');

  groupJoined: Group[] = [];
  groupJoined$: Observable<Group[]> = this.store.select('group', 'groupJoined');
  isGetJoinedSuccess$ = this.store.select('group', 'isGetJoinedSuccess');

  user$ = this.store.select('user', 'user');
  maxImagesToShow = 5;
  profile: Profile = <Profile>{};
  profile$ = this.store.select('profile', 'profile');

  idToken: string = '';
  idToken$ = this.store.select('auth', 'idToken');

  userFirebase$ = this.store.select('auth', 'firebaseUser');

  post$ = this.store.select('post', 'posts');
  posts: Post[] = [];
  avatarUrl: string = '';

  uid: string = '';
  subscriptions: Subscription[] = [];

  name: string = '';
  owner: string = '';
  members: string[] = [];

  groupId!: string | null;
  // member: Profile[] = [];
  join: boolean = false;

  userFirebase: any = null;
  constructor(
    private location: Location,
    private store: Store<{
      group: GroupState;
      user: UserState;
      auth: AuthState;
      profile: ProfileState;
      post: PostState;
    }>,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([this.idToken$, this.profile$]).subscribe(
        ([idToken, profile]) => {
          this.idToken = idToken;
          this.profile = profile;
        }
      ),
      this.groups$.subscribe((groups) => {
        if (groups._id) {
          this.groups = groups;
        }
      }),
      this.profile$.subscribe((profile) => {
        if (profile._id) {
          this.profile = profile;
        }
      }),

      this.post$.subscribe((posts) => {
        if (posts) {
          this.posts = posts;
        }
      }),

      this.route.queryParamMap.subscribe((params) => {
        this.groupId = params.get('id');
        if (this.groupId) {
          this.store.dispatch(
            GroupActions.getOne({ id: this.groupId, idToken: this.idToken })
          );
        }
        if (this.groupId === this.groups._id) {
          this.groups.members.forEach((member) => {
            if (member._id === this.profile._id) {
              this.join = true;
              console.log('tham gia rồi');
              // console.log(this.groups._id);
            } else {
              this.join = false;
              console.log('chưa tham gia');
              // console.log(this.groups._id);
            }
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  showImageInput = false;
  @ViewChild('appDialog2', { static: true })
  dialog2!: ElementRef<HTMLDialogElement>;
  cdr2 = inject(ChangeDetectorRef);

  handleImageUpload(event: any) {
    const file = event.target.files[0]; // Lấy file hình ảnh từ sự kiện

    // Thực hiện các xử lý liên quan đến tệp hình ảnh tại đây

    // Sau khi hoàn thành xử lý, bạn có thể ẩn input file bằng cách đặt lại biến showImageInput về false
    this.showImageInput = false;
  }

  openCommentDialog() {
    this.dialog2.nativeElement.showModal();
    this.cdr2.detectChanges();
  }
  closeCommentDialog() {
    this.dialog2.nativeElement.close();
    this.cdr2.detectChanges();
  }
  back() {
    this.router.navigate(['/group/suggest']);
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
      panelClass: ['snackbar'],
    });
  }
  getZIndex(index: number) {
    // Tính giá trị z-index dựa trên số lượng phần tử
    // Ví dụ: Tăng giá trị z-index theo số thứ tự ngược lại
    return this.groups.members.length - index + 1;
  }
}
