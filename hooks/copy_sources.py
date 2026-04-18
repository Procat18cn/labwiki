"""
MkDocs Hook: 将 docs/ 中的 .md 源文件复制到 site/_sources/
用于支持文档下载功能
"""

import shutil
import os


def on_post_build(config, **kwargs):
    docs_dir = config['docs_dir']
    site_dir = config['site_dir']
    sources_dir = os.path.join(site_dir, '_sources')

    for root, dirs, files in os.walk(docs_dir):
        for filename in files:
            if not filename.endswith('.md'):
                continue
            src_path = os.path.join(root, filename)
            rel_path = os.path.relpath(src_path, docs_dir)
            dst_path = os.path.join(sources_dir, rel_path)
            os.makedirs(os.path.dirname(dst_path), exist_ok=True)
            shutil.copy2(src_path, dst_path)
