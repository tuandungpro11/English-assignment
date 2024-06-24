import { plainToInstance } from 'class-transformer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ClassRepository, ClassStudentRepository, StudentRepository, TeacherRepository } from 'src/models/repositories';
import { ClassEntity, ClassStudentEntity, StudentEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource, In } from 'typeorm';
import _ from 'lodash'
import { CreateClassDto } from './dto/create-class.dto';
import { FilterClassDto, FilterClassStudentDto } from './dto/class-query.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { RemoveStudentDto } from './dto/remove-student.dto';

@Injectable()
export class ManageClassService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly classStudentRepository: ClassStudentRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}

  async createClass(creatorId: number, createClass: CreateClassDto) {
    const creator = await this.teacherRepository.getTeacherById(creatorId);
    const checkClassNameExist = await this.classRepository.isClassNameExist(
      createClass.name
    );
    if (checkClassNameExist) {
      throw new BaseException(ERROR.NAME_EXISTED);
    }
    
    const newClass = new ClassEntity();
    newClass.creator = creator;
    Object.assign(newClass, {
      ...createClass
    });
    
    return await this.classRepository.save(newClass);
  }
  
  async getClass(classId: number): Promise<any> {
    const classEntity = await this.classRepository.getClassById(classId);
    return classEntity;
  }
  
  async getListClasses(filterClass: FilterClassDto) {
    const classes = await this.classRepository.getListClasses(filterClass);
    return classes;
  }
  
  async updateInformationClass(classId: number, updateClass: UpdateClassDto) {
    const classEntity = await this.classRepository.getClassById(classId);
    return await this.classRepository.save({
      ...classEntity,
      ...updateClass
    })
  }
  
  async deleteClass(classId: number) {
    const { affected } = await this.classRepository.delete({ id: classId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
  
  async addStudentToClass(teacherId: number, addStudent: AddStudentDto) {
    const { classId, studentIds } = addStudent;
    const classroom = await this.classRepository.getClassById(classId);
    try {
      await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const studentRepository = queryRunner.manager.getRepository(StudentEntity);
          const students = await studentRepository.find({
            where: {
              id: In(studentIds)
            }
          });
          const insertBulkStudent = _.map(students, (student) => {
            return {
              student,
              class: classroom
            }
          })
          await queryRunner.manager.insert(
            ClassStudentEntity,
            insertBulkStudent
          );
        }
      );
      return 'Thành công';
    } catch (error) {
      console.log('add student: ', error);
      throw new BadRequestException('Thất bại');
    }
  }
  
  async removeStudentFromClass(teacherId: number, removeStudent: RemoveStudentDto) {
    const { classId, studentId } = removeStudent;
    const classroom = await this.classRepository.getClassById(classId);
    const student = await this.studentRepository.getStudentById(studentId);
    const { affected } = await this.classStudentRepository.delete({
      class: classroom,
      student
    });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
  
  async getListStudentInClass(filterClassStudentDto: FilterClassStudentDto) {
    const students = await this.classStudentRepository.getListStudentFromClass(filterClassStudentDto);
    return students;
  }
}
