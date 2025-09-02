export interface CreateTestDto {
  email: string;
  name?: string;
}

export interface TestResponseDto {
  id: number;
  email: string;
  name: string | null;
}
