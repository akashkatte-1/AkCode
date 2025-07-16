/*
  # Database Functions for CodePlatform

  1. Functions
    - update_user_stats_on_solve: Updates user stats when solving a problem
    - increment_user_submissions: Increments user submission count
    - update_problem_stats: Updates problem statistics
    - get_user_rank: Gets user's current rank
    - get_nearby_users: Gets users around a specific rank

  2. Security
    - Functions are created with proper security context
*/

-- Function to update user stats when solving a problem for the first time
CREATE OR REPLACE FUNCTION update_user_stats_on_solve(user_id uuid, xp_gain integer)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET 
    solved_problems = solved_problems + 1,
    total_submissions = total_submissions + 1,
    xp = xp + xp_gain,
    level = CASE 
      WHEN (xp + xp_gain) >= 1000 THEN ((xp + xp_gain) / 1000) + 1
      ELSE level
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user submissions
CREATE OR REPLACE FUNCTION increment_user_submissions(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET total_submissions = total_submissions + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update problem statistics
CREATE OR REPLACE FUNCTION update_problem_stats(problem_id uuid, is_accepted boolean)
RETURNS void AS $$
BEGIN
  UPDATE problems 
  SET 
    total_submissions = total_submissions + 1,
    accepted_submissions = CASE 
      WHEN is_accepted THEN accepted_submissions + 1 
      ELSE accepted_submissions 
    END,
    acceptance_rate = CASE 
      WHEN total_submissions + 1 > 0 THEN 
        ROUND(
          (CASE WHEN is_accepted THEN accepted_submissions + 1 ELSE accepted_submissions END * 100.0) / 
          (total_submissions + 1), 
          2
        )
      ELSE 0 
    END
  WHERE id = problem_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's rank
CREATE OR REPLACE FUNCTION get_user_rank(user_id uuid)
RETURNS TABLE(rank bigint, total_users bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rank_table.rank,
    rank_table.total_users
  FROM (
    SELECT 
      u.id,
      ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.solved_problems DESC) as rank,
      COUNT(*) OVER() as total_users
    FROM users u
    WHERE u.role = 'user'
  ) rank_table
  WHERE rank_table.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get users around a specific rank
CREATE OR REPLACE FUNCTION get_nearby_users(target_rank bigint, range_size integer)
RETURNS TABLE(
  id uuid,
  username text,
  avatar text,
  xp integer,
  solved_problems integer,
  rank bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rank_table.id,
    rank_table.username,
    rank_table.avatar,
    rank_table.xp,
    rank_table.solved_problems,
    rank_table.rank
  FROM (
    SELECT 
      u.id,
      u.username,
      u.avatar,
      u.xp,
      u.solved_problems,
      ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.solved_problems DESC) as rank
    FROM users u
    WHERE u.role = 'user'
  ) rank_table
  WHERE rank_table.rank BETWEEN (target_rank - range_size) AND (target_rank + range_size)
  ORDER BY rank_table.rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;