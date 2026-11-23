from urllib.parse import urlparse,parse_qs
import re
from youtube_transcript_api import YouTubeTranscriptApi
def youtube_id(url):
 p=urlparse(url)
 if p.hostname not in {'youtube.com','www.youtube.com','m.youtube.com','youtu.be'}: return None
 if p.hostname=='youtu.be': return p.path.strip('/')
 if p.path=='/watch': return parse_qs(p.query).get('v',[None])[0]
 m=re.match(r'/shorts/([^/]+)',p.path); return m.group(1) if m else None
def get_transcript(video_id):
 transcript=YouTubeTranscriptApi().fetch(video_id)
 return ' '.join(x.text for x in transcript),getattr(transcript,'language',None)
def chunk_text(text,max_chars=3500,overlap=350):
 chunks=[]; start=0
 while start<len(text):
  end=min(start+max_chars,len(text))
  if end<len(text):
   boundary=text.rfind(' ',start,end)
   if boundary>start+max_chars//2: end=boundary
  chunks.append(text[start:end].strip())
  if end>=len(text): break
  start=max(end-overlap,start+1)
 return chunks
