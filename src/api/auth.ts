import { supabase } from "../db/supabase";

export async function signIn(params: { email: string; password: string }) {
  const { email, password } = params;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signUp(params: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = params;

  // 1) Supabase Auth 회원가입
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("회원가입 실패");

  // 2) users 테이블에 추가 정보 저장
  const { error: insertError } = await supabase
    .from("users")
    .insert({ user_id: userId, name, email });

  if (insertError) throw insertError;
}
