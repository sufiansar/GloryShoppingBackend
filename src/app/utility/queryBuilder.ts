import { Prisma } from "../../generated/prisma";
import { excludeField } from "../constant";

export class PrismaQueryBuilder {
  private query: Record<string, string>;
  private prismaQuery: Prisma.Enumerable<any> & {
    where?: any;
    orderBy?: any;
    select?: any;
    skip?: number;
    take?: number;
  };

  constructor(query: Record<string, string>) {
    this.query = query;
    this.prismaQuery = {};
  }

  filter(filterableFields?: Record<string, (value: string) => any>): this {
    if (!filterableFields) return this;

    const andConditions: any[] = [];

    for (const [key, value] of Object.entries(this.query)) {
      if (excludeField.includes(key)) continue;
      if (!filterableFields[key]) continue;

      andConditions.push(filterableFields[key](value));
    }

    if (andConditions.length) {
      this.prismaQuery.where = {
        ...(this.prismaQuery.where || {}),
        AND: andConditions,
      };
    }

    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm;

    if (!searchTerm) return this;

    this.prismaQuery.where = {
      ...(this.prismaQuery.where || {}),
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    };

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "createdAt";
    const order = sort.startsWith("-") ? "desc" : "asc";
    const field = sort.replace("-", "");

    this.prismaQuery.orderBy = {
      [field]: order,
    };

    return this;
  }

  fields(): this {
    if (!this.query.fields) return this;

    const fieldsArray = this.query.fields.split(",");

    this.prismaQuery.select = fieldsArray.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.prismaQuery.skip = skip;
    this.prismaQuery.take = limit;

    return this;
  }

  build() {
    return this.prismaQuery;
  }

  async getMeta(model: any) {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const total = await model.count({
      where: this.prismaQuery.where,
    });

    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}
