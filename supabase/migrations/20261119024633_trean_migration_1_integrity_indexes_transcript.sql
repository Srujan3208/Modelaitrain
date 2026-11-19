-- TREAN AI Migration 1: integrity, processing metadata, transcript structure and retrieval indexes.
-- Non-destructive; existing tables and data are preserved.
ALTER TABLE public.videos
 ADD COLUMN IF NOT EXISTS processing_stage text NOT NULL DEFAULT 'pending',
 ADD COLUMN IF NOT EXISTS processing_progress integer NOT NULL DEFAULT 0,
 ADD COLUMN IF NOT EXISTS retry_count integer NOT NULL DEFAULT 0,
 ADD COLUMN IF NOT EXISTS last_error text,
 ADD COLUMN IF NOT EXISTS processed_at timestamptz,
 ADD COLUMN IF NOT EXISTS transcript_status text NOT NULL DEFAULT 'pending',
 ADD COLUMN IF NOT EXISTS transcript_language text,
 ADD COLUMN IF NOT EXISTS transcript_source text,
 ADD COLUMN IF NOT EXISTS transcript_fetched_at timestamptz,
 ADD COLUMN IF NOT EXISTS transcript_checksum text;
ALTER TABLE public.transcript_chunks
 ADD COLUMN IF NOT EXISTS language text,
 ADD COLUMN IF NOT EXISTS token_count integer,
 ADD COLUMN IF NOT EXISTS embedding_model text,
 ADD COLUMN IF NOT EXISTS embedding_version text,
 ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.knowledge_items
 ADD COLUMN IF NOT EXISTS subject text,
 ADD COLUMN IF NOT EXISTS topic text,
 ADD COLUMN IF NOT EXISTS difficulty_level text,
 ADD COLUMN IF NOT EXISTS tags jsonb NOT NULL DEFAULT '[]'::jsonb,
 ADD COLUMN IF NOT EXISTS embedding_model text,
 ADD COLUMN IF NOT EXISTS embedding_version text,
 ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.knowledge_sources
 ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'video_transcript',
 ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='videos_processing_progress_range') THEN ALTER TABLE public.videos ADD CONSTRAINT videos_processing_progress_range CHECK(processing_progress BETWEEN 0 AND 100); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='videos_retry_count_nonnegative') THEN ALTER TABLE public.videos ADD CONSTRAINT videos_retry_count_nonnegative CHECK(retry_count>=0); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='videos_status_valid') THEN ALTER TABLE public.videos ADD CONSTRAINT videos_status_valid CHECK(status IN('pending','processing','completed','failed','cancelled','retrying')); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='videos_processing_stage_valid') THEN ALTER TABLE public.videos ADD CONSTRAINT videos_processing_stage_valid CHECK(processing_stage IN('pending','fetching_metadata','extracting_transcript','chunking','generating_embeddings','extracting_knowledge','completed','failed','cancelled')); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='videos_transcript_status_valid') THEN ALTER TABLE public.videos ADD CONSTRAINT videos_transcript_status_valid CHECK(transcript_status IN('pending','available','unavailable','processing','failed')); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='transcript_chunks_index_nonnegative') THEN ALTER TABLE public.transcript_chunks ADD CONSTRAINT transcript_chunks_index_nonnegative CHECK(chunk_index>=0); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='transcript_chunks_timestamps_valid') THEN ALTER TABLE public.transcript_chunks ADD CONSTRAINT transcript_chunks_timestamps_valid CHECK((start_seconds IS NULL OR start_seconds>=0) AND (end_seconds IS NULL OR end_seconds>=0) AND (start_seconds IS NULL OR end_seconds IS NULL OR end_seconds>=start_seconds)); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='transcript_chunks_token_count_nonnegative') THEN ALTER TABLE public.transcript_chunks ADD CONSTRAINT transcript_chunks_token_count_nonnegative CHECK(token_count IS NULL OR token_count>=0); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_items_confidence_range') THEN ALTER TABLE public.knowledge_items ADD CONSTRAINT knowledge_items_confidence_range CHECK(confidence BETWEEN 0 AND 1); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_items_type_valid') THEN ALTER TABLE public.knowledge_items ADD CONSTRAINT knowledge_items_type_valid CHECK(knowledge_type IN('concept','definition','summary','example','formula','question','answer','key_point','relationship','note')); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_items_difficulty_valid') THEN ALTER TABLE public.knowledge_items ADD CONSTRAINT knowledge_items_difficulty_valid CHECK(difficulty_level IS NULL OR difficulty_level IN('beginner','intermediate','advanced')); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_items_tags_array') THEN ALTER TABLE public.knowledge_items ADD CONSTRAINT knowledge_items_tags_array CHECK(jsonb_typeof(tags)='array'); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='transcript_chunks_metadata_object') THEN ALTER TABLE public.transcript_chunks ADD CONSTRAINT transcript_chunks_metadata_object CHECK(jsonb_typeof(metadata)='object'); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_items_metadata_object') THEN ALTER TABLE public.knowledge_items ADD CONSTRAINT knowledge_items_metadata_object CHECK(jsonb_typeof(metadata)='object'); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_sources_confidence_range') THEN ALTER TABLE public.knowledge_sources ADD CONSTRAINT knowledge_sources_confidence_range CHECK(source_confidence BETWEEN 0 AND 1); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='knowledge_sources_timestamps_valid') THEN ALTER TABLE public.knowledge_sources ADD CONSTRAINT knowledge_sources_timestamps_valid CHECK((source_start_seconds IS NULL OR source_start_seconds>=0) AND (source_end_seconds IS NULL OR source_end_seconds>=0) AND (source_start_seconds IS NULL OR source_end_seconds IS NULL OR source_end_seconds>=source_start_seconds)); END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS videos_user_youtube_id_uidx ON public.videos(user_id,youtube_video_id);
CREATE UNIQUE INDEX IF NOT EXISTS transcript_chunks_video_chunk_uidx ON public.transcript_chunks(video_id,chunk_index);
CREATE UNIQUE INDEX IF NOT EXISTS knowledge_sources_knowledge_video_uidx ON public.knowledge_sources(knowledge_id,video_id);
CREATE INDEX IF NOT EXISTS videos_user_created_idx ON public.videos(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS videos_user_status_idx ON public.videos(user_id,status);
CREATE INDEX IF NOT EXISTS transcript_chunks_video_time_idx ON public.transcript_chunks(video_id,start_seconds);
CREATE INDEX IF NOT EXISTS knowledge_items_user_created_idx ON public.knowledge_items(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS knowledge_items_user_type_idx ON public.knowledge_items(user_id,knowledge_type);
CREATE INDEX IF NOT EXISTS knowledge_items_user_subject_topic_idx ON public.knowledge_items(user_id,subject,topic);
CREATE INDEX IF NOT EXISTS knowledge_sources_user_video_idx ON public.knowledge_sources(user_id,video_id);
CREATE INDEX IF NOT EXISTS learning_profiles_updated_idx ON public.learning_profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS transcript_chunks_embedding_hnsw_idx ON public.transcript_chunks USING hnsw(embedding vector_cosine_ops) WHERE embedding IS NOT NULL;
CREATE INDEX IF NOT EXISTS knowledge_items_embedding_hnsw_idx ON public.knowledge_items USING hnsw(embedding vector_cosine_ops) WHERE embedding IS NOT NULL;
