import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/studet.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';
@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string|null|undefined;
  student: Student ={
    id:'',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
    mobile: 0 ,
    genderId:'',
    profileImageUrl:'',
    gender:{
      id:'',
      description:'',
    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    }
  };

  isNewStudent = false;
  header = '';

  genderList: Gender[]=[];

  constructor(private readonly studentService : StudentService ,private readonly route: ActivatedRoute , private readonly         genderService:GenderService, private snackbar: MatSnackBar ,
    private router : Router) { }

  ngOnInit(): void {
   this.route.paramMap.subscribe(
     (params)=>{
      this.studentId = params.get('id');

      if (this.studentId) {
        // If the route Contains the 'Add'

        if(this.studentId.toLocaleLowerCase()== 'Add'.toLocaleLowerCase()){
          //->new Student Functionality
          this.isNewStudent = true;
          this.header = 'Add New Student';
        }
        else{

        //otherwise
        //->Existing Student Functionality
        this.isNewStudent = false;
        this.header = 'Edit Student';

        this.studentService.getStudent(this.studentId)
        .subscribe((res)=>
        {
          this.student = res;

        }
        );
     }

       this.genderService.getGenderList()
       .subscribe((res)=>
       {
         this.genderList = res;

       }
      );
      }
     }
     );
  }

  onUpdate(): void{

    this.studentService.updateStudent(this.student.id, this.student).subscribe(
      (res) =>{
        //console.log(res);

        // Show a notification

        this.snackbar.open('Student updated successfully', undefined ,{
          duration:2000
        });
      },
      (err)=>{
        //log it
      }
    );

    //Call Student Services to Update Student
  }
  onDelete(): void{
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (res)=>{
        this.snackbar.open('Student Deleted Successfully',undefined,{
         duration:2000
        });

        setTimeout(()=>{
          this.router.navigateByUrl('students');
        },2000);

      },
      (err)=>{
          //log
      }
    );
   // student service  to delete
  }
  onAdd(): void{
 this.studentService.addStudent(this.student).subscribe(
(res)=> {
  //console.log(res);
  this.snackbar.open('Student Added Successfully',undefined,{
    duration:2000
   });

   setTimeout(()=>{
    this.router.navigateByUrl(`students/${res.id}`);
  },2000);

},
(err)=>{
 //Log it
}
 );
  }

}
