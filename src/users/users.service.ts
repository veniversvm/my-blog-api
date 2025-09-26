import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';

// --- ¡ESTOS DOS IMPORTS SON LA SOLUCIÓN! ---
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getAllUsers(paginationQuery: PaginationQueryDto): Promise<PaginationResult<UserEntity>> {
    const { limit, page } = paginationQuery;
    const skip = (page - 1) * limit;

    const [users, totalItems] = await this.userRepository.findAndCount({
      take: limit,
      skip: skip,
      // Es una buena práctica cargar las relaciones necesarias, como el perfil.
      relations: ['profile'],
      order: {
        createdAt: 'DESC',
      },
    });

    const totalPages = Math.ceil(totalItems / limit);
    const meta = {
      totalItems,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return { data: users, meta };
  }

  ///////////////
  ///////////////

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    return user;
  }

  ///////////////
  ///////////////

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.userRepository.save(createUserDto);
    // await this.profileRepository.save(createUserDto.profile);
    return newUser;
  }

  ///////////////
  ///////////////

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
      updateUserDto.profile.id = userToUpdate.profile.id;
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

  ///////////////
  ///////////////

  async deleteUser(id: number): Promise<void> {
    // Cambiamos el retorno a void por convención
    const result: DeleteResult = await this.userRepository.delete(id);

    // Si no se afectó ninguna fila, significa que el usuario no existía.
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
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

  ///////////////
  ///////////////

  async getUserFullName(id: number): Promise<string> {
    const cacheKey = `user_fullname_${id}`;

    // 1. Intentar obtener el nombre del caché
    const cachedName = await this.cacheManager.get<string>(cacheKey);
    if (cachedName) {
      console.log(`Getting user ${id} name from CACHE`);
      return cachedName;
    }

    // 2. Si no está en caché, buscar en la base de datos
    console.log(`Getting user ${id} name from DATABASE`);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user || !user.profile) {
      throw new NotFoundException(`Usuario o perfil con ID '${id}' no encontrado.`);
    }

    const fullName = `${user.profile.name} ${user.profile.lastName}`;

    // 3. Guardar el resultado en el caché para futuras peticiones
    await this.cacheManager.set(cacheKey, fullName);

    return fullName;
  }
}
