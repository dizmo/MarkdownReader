import os

dizmo = __import__('grace-dizmo.plugin')
DizmoPlugin = getattr(dizmo.plugin, 'Dizmo')

class MdReaderDizmoPlugin (DizmoPlugin):

    def after_build(self):
        DizmoPlugin.after_build (self)

        name = self._config['name']
        properties = self._config.get ('dizmo_private', {})
        script = self._config['js_name'] + '.js'
        target = os.path.join(self._config['build_path'], script)

        if os.path.exists(target):
            with open (target, 'a') as file: file.writelines([
                "\n%s.Dizmo.save ('%s', '%s');" % (name, k, v)
                    for k, v in properties.items ()
            ])

locals()['Md-Reader-Dizmo'] = MdReaderDizmoPlugin
