-- Add covering index for knowledge_item_id FK on chat context mapping.
create index chat_session_knowledge_knowledge_item_idx on public.chat_session_knowledge_items(knowledge_item_id);
