const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Back-end Test',
      version: '1.0.0',
      description: 'API for CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/api/login': {
        post: {
          summary: 'Login to get JWT token',
          description: 'Authenticate user and return a JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                  },
                  required: ['username', 'password']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Invalid credentials'
            }
          }
        }
      },
      '/api/seeds': {
        get: {
          summary: 'Get all seeds',
          description: 'Retrieve a list of all seeds',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: { type: 'integer' },
                        Seed_RepDate: { type: 'integer' },
                        Seed_Year: { type: 'integer' },
                        Seeds_YearWeek: { type: 'integer' },
                        Seed_Varity: { type: 'string' },
                        Seed_RDCSD: { type: 'string' },
                        Seed_Stock2Sale: { type: 'integer' },
                        Seed_Season: { type: 'integer' },
                        Seed_Crop_Year: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        },
        post: {
          summary: 'Add a new seed',
          description: 'Create a new seed entry',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'integer' },
                    Seed_RepDate: { type: 'integer' },
                    Seed_Year: { type: 'integer' },
                    Seeds_YearWeek: { type: 'integer' },
                    Seed_Varity: { type: 'string' },
                    Seed_RDCSD: { type: 'string' },
                    Seed_Stock2Sale: { type: 'integer' },
                    Seed_Season: { type: 'integer' },
                    Seed_Crop_Year: { type: 'string' }
                  },
                  required: ['_id', 'Seed_RepDate', 'Seed_Year', 'Seeds_YearWeek', 'Seed_Varity', 'Seed_RDCSD', 'Seed_Stock2Sale', 'Seed_Season', 'Seed_Crop_Year']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Seed created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      id: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      },
      '/api/seeds/{id}': {
        get: {
          summary: 'Get a seed by ID',
          description: 'Retrieve a specific seed by its ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: { type: 'integer' },
                      Seed_RepDate: { type: 'integer' },
                      Seed_Year: { type: 'integer' },
                      Seeds_YearWeek: { type: 'integer' },
                      Seed_Varity: { type: 'string' },
                      Seed_RDCSD: { type: 'string' },
                      Seed_Stock2Sale: { type: 'integer' },
                      Seed_Season: { type: 'integer' },
                      Seed_Crop_Year: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Seed not found'
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        },
        put: {
          summary: 'Update a seed by ID',
          description: 'Update an existing seed by its ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    Seed_RepDate: { type: 'integer' },
                    Seed_Year: { type: 'integer' },
                    Seeds_YearWeek: { type: 'integer' },
                    Seed_Varity: { type: 'string' },
                    Seed_RDCSD: { type: 'string' },
                    Seed_Stock2Sale: { type: 'integer' },
                    Seed_Season: { type: 'integer' },
                    Seed_Crop_Year: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Seed updated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Seed not found'
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        },
        delete: {
          summary: 'Delete a seed by ID',
          description: 'Delete a specific seed by its ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Seed deleted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Seed not found'
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      }
    }
  };
  
  module.exports = swaggerDefinition;