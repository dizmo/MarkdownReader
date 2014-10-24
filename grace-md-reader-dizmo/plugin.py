import os, json

dizmo = __import__('grace-dizmo.plugin')
DizmoPlugin = getattr (dizmo.plugin, 'Dizmo')

class MdReaderDizmoPlugin (DizmoPlugin):

    def after_build(self):
        DizmoPlugin.after_build (self)

        properties = self._config.get ('dizmo_private_store', {})
        script = self._config['js_name'] + '.js'
        target = os.path.join (self._config['build_path'], script)

        if os.path.exists (target):
            with open (target, 'a') as file: file.writelines([
                "\nMarkdownReader.Dizmo.save('%s', %s);" % (k, json.dumps (v))
                    for k, v in properties.items ()
            ])

locals ()['Md-Reader-Dizmo'] = MdReaderDizmoPlugin
