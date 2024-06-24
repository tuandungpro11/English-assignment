export const commonHttpErrors = {
  UNKNOWN_ERROR: {
    message: 'Internal Server Error',
    code: "ERROR_00000",
  },
  UNAUTHORIZED: {
    message: 'Unauthorized',
    code: "ERROR_00001",
  },
  FORBIDDEN: {
    message: 'Forbidden',
    code: "ERROR_00002",
  },
  TOO_MANY_REQUESTS: {
    message: 'Too Many Requests',
    code: "ERROR_00003",
  },
  REFRESH_TOKEN_FAIL: {
    message: 'Token Fail',
    code: "ERROR_00004",
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Token Expired',
    code: "ERROR_00005",
  },
  NOT_FOUND: {
    message: 'Không tìm thấy',
    code: "ERROR_00006"
  },
  FAILED: {
    message: 'Thất bại',
    code: "ERROR_00007"
  },
  DELETE_FAILED: {
    message: 'Xóa thất bại',
    code: "ERROR_00008"
  },
  UPDATE_FAILED: {
    message: 'Cập nhật thất bại',
    code: "ERROR_00009"
  },
  REGISTER_FAIL: {
    message: 'Đăng kí thất bại',
    code: "ERROR_00010",
  },
  NAME_EXISTED: {
    message: 'Tên đã tồn tại',
    code: "ERROR_00011",
  },
  INVALID_PARAMS: {
    message: 'Tham số không hợp lệ',
    code: "ERROR_00012",
  }
};
