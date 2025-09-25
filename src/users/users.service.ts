import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class UsersService {
  ///////////////
  ///////////////
  ///////////////

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  ///////////////
  ///////////////
  ///////////////
  //  METHODS  //
  ///////////////
  ///////////////
  ///////////////

  ///////////////
  //   USERS   //
  ///////////////

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.userRepository.save(createUserDto);
    // await this.profileRepository.save(createUserDto.profile);
    return newUser;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // 1. Cargamos la entidad existente CON sus relaciones para obtener el ID del perfil.
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'], // Es crucial cargar el perfil aquí
    });

    if (!userToUpdate) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }

    // 2. Si el DTO incluye un perfil, nos aseguramos de que tenga el ID del perfil existente.
    //    Esto le dice a TypeORM que debe ACTUALIZAR el perfil en lugar de crear uno nuevo.
    if (updateUserDto.profile && userToUpdate.profile) {
      // TypeScript puede quejarse aquí si UpdateProfileDto no tiene 'id'.
      // Usamos 'any' como un atajo seguro en este contexto.
      (updateUserDto.profile as any).id = userToUpdate.profile.id;
    }

    // 3. Ahora usamos 'preload' para fusionar de forma segura los cambios del DTO
    //    en la entidad que cargamos.
    const mergedUser = await this.userRepository.preload({
      ...userToUpdate, // Empezamos con el usuario existente completo
      ...updateUserDto, // Sobrescribimos con los cambios del DTO
    });

    // Esto no debería pasar si la primera búsqueda tuvo éxito, pero es una buena práctica.
    if (!mergedUser) {
      throw new NotFoundException(`No se pudo pre-cargar el usuario con ID '${id}'.`);
    }

    // 4. Guardamos la entidad fusionada. TypeORM ahora sabe que debe hacer un UPDATE
    //    tanto en el usuario como en el perfil.
    return this.userRepository.save(mergedUser);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    const result = await this.userRepository.delete(user);
    return result;
  }

  ///////////////
  // PROFILES //
  ///////////////

  async findUserProfile(id: number) {
    const user = await this._findUserWithProfile(id);
    return user.profile;
  }

  async _findUserWithProfile(id: number) {
    //* No realizamos la relacion mas arriba dado que la operacion aqui presenter es mas costosa *//
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'], // <-- ¡ESTA ES LA LÍNEA MÁGICA!
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }

    return user;
  }
}
